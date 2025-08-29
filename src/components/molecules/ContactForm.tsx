"use client";
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

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange =
    (field: keyof ContactFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);

    setLoading(true);

    // The URL of your Google Apps Script Web App
    // todo: add script in Google Scripts
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbxG0q7I_X0A95X6gINZ3yM7LNty1H2MqRphuJRCK0Ei9w-WHrz0SSLl6rccsV_8q1iS/exec";
    // "https://script.google.com/macros/s/AKfycbw5o-nLD2lWtJ_i4TWHN_-VV1EUaT6c_wR0EhC_JmdAm2W49_uNvT7uSDudo5nqInNe/exec";

    // Prepare form data
    const formBody = new URLSearchParams();
    formBody.append("name", formData.name);
    formBody.append("email", formData.email);
    formBody.append("message", formData.message);

    try {
      const response = await fetch(scriptUrl, {
        method: "POST",
        body: formBody,
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.log("Error:", error);
      setError("An error occurred. Please try again later.");
    }
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

      <div className={`form-block ${success || error ? "hidden" : "block"}`}>
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <Button type="submit" variant="filled" disabled={loading} className={`w-full ${themeClasses.buttonClasses}`}>
          {loading ? "Sending..." : "Send Message"}
        </Button>
      </div>

      <div className={`success ${success ? "block" : "hidden"}`}>
        {success && <p className="">Your message has been sent successfully!</p>}
      </div>

      <div className={`error ${error !== "" ? "block" : "hidden"}`}>
        {error && <p className="text-red-800">{error}</p>}
      </div>
    </form>
  );
}
