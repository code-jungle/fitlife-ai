import os
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest
)
from models import PaymentTransaction, SubscriptionStatus

# Fixed subscription packages (NEVER accept prices from frontend)
SUBSCRIPTION_PACKAGES = {
    "monthly_subscription": {
        "amount": 14.90,
        "currency": "brl",
        "name": "FitLife AI Premium - Mensal",
        "trial_days": 7
    }
}

class PaymentService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.trial_duration_days = 7
    
    def get_stripe_checkout(self, webhook_url: str) -> StripeCheckout:
        """Initialize Stripe checkout with webhook URL"""
        return StripeCheckout(
            api_key=self.api_key,
            webhook_url=webhook_url
        )
    
    def get_package_details(self, package_id: str) -> dict:
        """Get package details - ONLY from server-side definition"""
        if package_id not in SUBSCRIPTION_PACKAGES:
            raise HTTPException(status_code=400, detail="Pacote de assinatura inválido")
        return SUBSCRIPTION_PACKAGES[package_id]
    
    async def create_checkout_session(
        self,
        stripe_checkout: StripeCheckout,
        user_id: str,
        user_email: str,
        package_id: str,
        origin_url: str
    ) -> CheckoutSessionResponse:
        """
        Create a Stripe checkout session
        
        SECURITY: Amount is defined server-side only, never from frontend
        """
        # Get package details from server-side definition
        package = self.get_package_details(package_id)
        
        # Build dynamic URLs from frontend origin
        success_url = f"{origin_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{origin_url}/dashboard"
        
        # Create metadata with user info
        metadata = {
            "user_id": user_id,
            "user_email": user_email,
            "package_id": package_id,
            "trial_days": str(package["trial_days"])
        }
        
        # Create checkout session request
        checkout_request = CheckoutSessionRequest(
            amount=package["amount"],
            currency=package["currency"],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata
        )
        
        # Create session
        session = await stripe_checkout.create_checkout_session(checkout_request)
        
        return session
    
    def is_user_premium(self, user_id: str, db) -> bool:
        """Check if user is currently premium"""
        # Check if user has active trial
        user_doc = db.users.find_one({"id": user_id})
        if not user_doc:
            return False
        
        created_at = user_doc.get("created_at")
        if created_at:
            trial_end = created_at + timedelta(days=self.trial_duration_days)
            if datetime.utcnow() < trial_end:
                return True  # Still in trial
        
        # Check if user has paid subscription
        subscription = db.subscriptions.find_one({"user_id": user_id})
        if subscription:
            subscription_end = subscription.get("subscription_ends_at")
            if subscription_end and datetime.utcnow() < subscription_end:
                return True
        
        return False
    
    def get_subscription_status(self, user_id: str, db) -> dict:
        """Get detailed subscription status"""
        user_doc = db.users.find_one({"id": user_id})
        if not user_doc:
            return {
                "is_premium": False,
                "status": "no_account"
            }
        
        created_at = user_doc.get("created_at")
        trial_end = created_at + timedelta(days=self.trial_duration_days) if created_at else None
        
        # Check trial
        if trial_end and datetime.utcnow() < trial_end:
            days_left = (trial_end - datetime.utcnow()).days
            return {
                "is_premium": True,
                "status": "trial",
                "trial_ends_at": trial_end.isoformat(),
                "days_left": days_left
            }
        
        # Check paid subscription
        subscription = db.subscriptions.find_one({"user_id": user_id})
        if subscription:
            subscription_end = subscription.get("subscription_ends_at")
            if subscription_end and datetime.utcnow() < subscription_end:
                days_left = (subscription_end - datetime.utcnow()).days
                return {
                    "is_premium": True,
                    "status": "active",
                    "subscription_ends_at": subscription_end.isoformat(),
                    "days_left": days_left
                }
        
        # Trial ended, no subscription
        return {
            "is_premium": False,
            "status": "trial_ended",
            "trial_ended_at": trial_end.isoformat() if trial_end else None
        }
    
    async def process_successful_payment(
        self,
        db,
        session_id: str,
        payment_status: str,
        metadata: dict
    ) -> bool:
        """
        Process successful payment - only once per session
        
        Returns: True if processed, False if already processed
        """
        # Check if already processed
        existing_transaction = db.payment_transactions.find_one({
            "session_id": session_id,
            "payment_status": "paid"
        })
        
        if existing_transaction:
            print(f"Payment {session_id} already processed, skipping")
            return False
        
        # Update transaction status
        db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": payment_status,
                "updated_at": datetime.utcnow()
            }}
        )
        
        # If payment is successful, activate subscription
        if payment_status == "paid":
            user_id = metadata.get("user_id")
            
            # Calculate subscription end date (1 month from now)
            subscription_end = datetime.utcnow() + timedelta(days=30)
            
            # Create or update subscription
            db.subscriptions.update_one(
                {"user_id": user_id},
                {"$set": {
                    "user_id": user_id,
                    "is_premium": True,
                    "subscription_ends_at": subscription_end,
                    "updated_at": datetime.utcnow()
                }},
                upsert=True
            )
            
            print(f"✅ Subscription activated for user {user_id} until {subscription_end}")
            return True
        
        return False

# Create singleton instance
payment_service = PaymentService(api_key=os.environ.get("STRIPE_API_KEY"))
