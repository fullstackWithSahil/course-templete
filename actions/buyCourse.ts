"use server";

import { getPaymentLink } from "@/lib/getPaymentLik";
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

    const paymentLink = await getPaymentLink({
      customer:{customerName,email:customerEmail,userId:user.id},
      productId:courseId,
      productType:"course",
      price:33,
      description:"Buying a "
    })
    if(paymentLink.success){
      return {
        success: true,
        message: "Payment link generated successfully",
        paymentUrl: paymentLink.url
      };
    }else{
      throw paymentLink.error
    }
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