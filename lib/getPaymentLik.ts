import Razorpay from "razorpay";

export async function getPaymentLink({
    price,
    description,
    customer,
    productId,
    productType
}:{
    price:number,
    description:string,
    customer:{customerName:string;userId:string;email:string},
    productType:string,
    productId:number
}){
    try {
        // Initialize Razorpay instance
        const instance = new Razorpay({ 
            key_id: process.env.KEY_ID!, 
            key_secret: process.env.SECRET_KEY!
        });
        const paymentLinkOptions = {
            amount: price*100, // Convert to paise
            currency: "INR",
            description,
            customer: {
                name: customer.customerName,
                email: customer.email,
                contact: "" // Add phone if available
            },
            notify: {
                sms: false,
                email: true // Enable email notifications
            },
            reminder_enable: true,
            notes: {
                productId,
                userId: customer.userId,
                userEmail: customer.email, // Add email to notes as well
                userName: customer.customerName,
                purpose: "course_purchase",
                productType
            },
            callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-courses`,
            callback_method: "get",
            // Add expire_by to avoid stale links (24 hours from now)
            expire_by: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };
        const newPaymentLink = await instance.paymentLink.create(paymentLinkOptions);
        return {
            success:true,
            message:"Payment Url created successfully",
            url:newPaymentLink.short_url
        }
        
    } catch (error) {
        return {
            success:false,
            message:"Error getting the payment link",
            error
        }
    }
}