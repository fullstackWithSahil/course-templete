"use server";

import { supabaseClient } from "@/lib/server/Supabase";
import { currentUser } from "@clerk/nextjs/server";
import Razorpay from 'razorpay';

interface BuyCourseResult {
  success: boolean;
  message: string;
  paymentUrl?: string;
  paymentLinkId?: string;
}

export default async function buyCourse(
  userId: string,
  courseId: number
): Promise<BuyCourseResult> {
  try {
    const user = await currentUser();
    if(!user){
      return{
        success: false,
        message: "You are not logged in"
      }
    }
    const supabase = supabaseClient();
    
    // Get course details including price
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (courseError || !courseData) {
      return {
        success: false,
        message: "Course not found"
      };
    }

    // Check if user already owns the course
    const { data: existingPurchase } = await supabase
      .from("students")
      .select("*")
      .eq("student", userId)
      .eq("course", courseId)
      .single();

    if (existingPurchase?.purchased) {
      return {
        success: false,
        message: "You already own this course"
      };
    }
    
    if(!existingPurchase){
      const {error} = await supabase.from("students").insert({
        student: user.id,
        name: user.fullName,
        email: typeof user.primaryEmailAddress === "string"
          ? user.primaryEmailAddress
          : user.primaryEmailAddress?.emailAddress ?? "",
        course: courseId,
        teacher: process.env.NEXT_PUBLIC_TEACHER
      })
      if(error){
        return {
          success: false,
          message: "Error purchasing the course"
        }
      }
    }

    // Check if price is valid
    if (courseData.price == null || courseData.price <= 0) {
      return {
        success: false,
        message: "Course price is not available"
      };
    }

    // Initialize Razorpay instance
    const instance = new Razorpay({ 
      key_id: process.env.KEY_ID!, 
      key_secret: process.env.SECRET_KEY!
    });

    // Extract email properly
    const customerEmail = typeof user.primaryEmailAddress === "string" 
      ? user.primaryEmailAddress 
      : user.primaryEmailAddress?.emailAddress ?? "";
    
    const customerName = user.fullName ?? "";

    // Validate email
    if (!customerEmail) {
      return {
        success: false,
        message: "User email is required for payment"
      };
    }

    console.log(`Creating payment for user: ${customerName} (${customerEmail})`);

    // Create new payment link (removed the existing link check for simplicity)
    const paymentLinkOptions = {
      amount: courseData.price * 100, // Convert to paise
      currency: "INR",
      description: `Purchase course: ${courseData.name || `Course ${courseId}`}`,
      customer: {
        name: customerName,
        email: customerEmail,
        contact: "" // Add phone if available
      },
      notify: {
        sms: false,
        email: true // Enable email notifications
      },
      reminder_enable: true,
      notes: {
        courseId: courseId.toString(),
        userId: userId,
        userEmail: customerEmail, // Add email to notes as well
        userName: customerName,
        purpose: "course_purchase"
      },
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-courses`,
      callback_method: "get",
      // Add expire_by to avoid stale links (24 hours from now)
      expire_by: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
    };

    console.log("Payment Link Options:", JSON.stringify(paymentLinkOptions, null, 2));

    const newPaymentLink = await instance.paymentLink.create(paymentLinkOptions);
    
    console.log(`Created payment link: ${newPaymentLink.id} for ${customerEmail}`);

    return {
      success: true,
      message: "Payment link generated successfully",
      paymentUrl: newPaymentLink.short_url,
      paymentLinkId: newPaymentLink.id
    };

  } catch (error) {
    console.error("Error buying the course:", error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    }

    // Handle specific Razorpay errors
    if (error instanceof Error) {
      if (error.message.includes("authentication")) {
        return {
          success: false,
          message: "Payment service configuration error"
        };
      }
      if (error.message.includes("network")) {
        return {
          success: false,
          message: "Network error. Please try again."
        };
      }
      if (error.message.includes("customer")) {
        return {
          success: false,
          message: "Invalid customer information"
        };
      }
    }

    return {
      success: false,
      message: "Error buying the course"
    };
  }
}