import PlanSelectionController from './PlanSelectionController'
import PaystackCheckoutController from './PaystackCheckoutController'
import PaystackCallbackController from './PaystackCallbackController'
import PaystackWebhookController from './PaystackWebhookController'
const Billing = {
    PlanSelectionController: Object.assign(PlanSelectionController, PlanSelectionController),
PaystackCheckoutController: Object.assign(PaystackCheckoutController, PaystackCheckoutController),
PaystackCallbackController: Object.assign(PaystackCallbackController, PaystackCallbackController),
PaystackWebhookController: Object.assign(PaystackWebhookController, PaystackWebhookController),
}

export default Billing