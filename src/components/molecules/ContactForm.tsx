"use client"
import { Button, InputField, Label, Textarea } from "@/components/atoms";
import { useState } from "react";

type BrandColorTheme = "sand" | "water" | "sky";

interface ContactFormProps {
  brandColorTheme?: BrandColorTheme;
  onSubmit?: (data: ContactFormData) => void;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export function ContactForm({ brandColorTheme = "water", onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange =
    (field: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  // Generate class names based on the brand color theme
  const getThemeClasses = () => {
    const baseClasses = {
      formBorder: `border-2 border-${brandColorTheme}-200`,
      titleColor: `text-${brandColorTheme}-700`,
      buttonClasses: `bg-${brandColorTheme}-600 hover:bg-${brandColorTheme}-700 border-${brandColorTheme}-600 hover:border-${brandColorTheme}-700 text-white`,
      inputFocus: `focus:border-${brandColorTheme}-500 focus:ring-${brandColorTheme}-500`,
    };
    return baseClasses;
  };

  const themeClasses = getThemeClasses();

  return (
    <form
      onSubmit={handleSubmit}
      className={`contact-form w-full max-w-lg p-8 rounded-lg bg-white shadow-lg ${themeClasses.formBorder}`}
    >
      <h2 className={`${themeClasses.titleColor} mb-6 text-2xl font-bold`}>Contact Us</h2>

      <div className="mb-4">
        <Label variant="required" className="block mb-2">
          Name
        </Label>
        <InputField
          value={formData.name}
          onChange={handleInputChange("name")}
          placeholder="Enter your name"
          fullWidth
          className={themeClasses.inputFocus}
          required
        />
      </div>

      <div className="mb-4">
        <Label variant="required" className="block mb-2">
          Email
        </Label>
        <InputField
          type="email"
          value={formData.email}
          onChange={handleInputChange("email")}
          placeholder="Enter your email"
          fullWidth
          className={themeClasses.inputFocus}
          required
        />
      </div>

      <div className="mb-6">
        <Label variant="required" className="block mb-2">
          Message
        </Label>
        <Textarea
          value={formData.message}
          onChange={handleInputChange("message")}
          placeholder="Enter your message"
          rows={4}
          fullWidth
          className={themeClasses.inputFocus}
          required
        />
      </div>

      <Button type="submit" variant="filled" className={`w-full ${themeClasses.buttonClasses}`}>
        Send Message
      </Button>
    </form>
  );
}
