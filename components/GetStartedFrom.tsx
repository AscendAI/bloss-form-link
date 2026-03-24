"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  User, 
  Phone, 
  Mail, 
  Star, 
  Target, 
  Search, 
  ArrowRight
} from "lucide-react";
import { z } from "zod";
import { FaInstagram } from "react-icons/fa";

const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  instagram: z.string().url("Invalid Instagram URL"),
  goals: z.string().min(1, "Goals are required"),
  findUs: z.string().min(1, "This field is required"),
});

export default function GetStartedFrom() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    instagram: "",
    goals: "",
    findUs: "",
  });

  const [errors, setErrors] = useState<z.ZodError | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error);
    } else {
      setErrors(null);
      // Handle successful form submission
      console.log("Form submitted successfully:", result.data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10 mx-5">
      <Card className="sm:max-w-[480px] w-full sm:px-4 px-2 pb-6">
        <CardHeader className="text-center py-4 sm:px-10 px-2">
          <CardTitle className="text-2xl font-bold">Get Started Today</CardTitle>
          <CardDescription className="text-sm">
            Fill in your details and unlock access to our exclusive community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-5">
              <div className="flex flex-col space-y-3">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                {errors?.issues.find((err) => err.path[0] === "fullName") && (
                  <p className="text-red-500 text-sm">{errors.issues.find((err) => err.path[0] === "fullName")?.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                {errors?.issues.find((err) => err.path[0] === "phone") && (
                  <p className="text-red-500 text-sm">{errors.issues.find((err) => err.path[0] === "phone")?.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                {errors?.issues.find((err) => err.path[0] === "email") && (
                  <p className="text-red-500 text-sm">{errors.issues.find((err) => err.path[0] === "email")?.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="instagram">Instagram Profile</Label>
                <div className="relative">
                  <FaInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="instagram"
                    name="instagram"
                    placeholder="https://instagram.com/yourprofile"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                {errors?.issues.find((err) => err.path[0] === "instagram") && (
                  <p className="text-red-500 text-sm">{errors.issues.find((err) => err.path[0] === "instagram")?.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <Label htmlFor="goals">Your Goals</Label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 w-4 h-4 text-white/40" />
                  <Textarea
                    id="goals"
                    name="goals"
                    placeholder="Tell us about your goals and what you hope to achieve..."
                    value={formData.goals}
                    onChange={handleInputChange}
                    className="px-10 h-28"
                  />
                </div>
                {errors?.issues.find((err) => err.path[0] === "goals") && (
                  <p className="text-red-500 text-sm">{errors.issues.find((err) => err.path[0] === "goals")?.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-3">
                <Label htmlFor="findUs">How Did You Find Us?</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="findUs"
                    name="findUs"
                    placeholder="e.g. Instagram, TikTok, a friend, Google..."
                    value={formData.findUs}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                {errors?.issues.find((err) => err.path[0] === "findUs") && (
                  <p className="text-red-500 text-sm">{errors.issues.find((err) => err.path[0] === "findUs")?.message}</p>
                )}
              </div>
            </div>
            <CardFooter className="flex justify-center">
              <Button type="submit" className="w-full text-base font-semibold p-10 bg-gradient-to-r rounded-xl from-[#8E31E3] to-[#A352EF] text-white">
                Submit & Unlock Discord
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
