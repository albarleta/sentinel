import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-[#4971bb]">
                Contact our sales team
              </h1>
              <p className="mt-4 text-gray-500 leading-relaxed">
                Get help with pricing and plans, schedule a demo, explore
                use-cases for your team, and more.
              </p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-gray-500">
                <Building2 className="h-5 w-5 shrink-0" />
                <div>
                  <p>Manila</p>
                  <p>Philippines</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <Phone className="h-5 w-5 shrink-0" />
                <p>+63 916-489-0881</p>
              </div>

              <div className="flex items-center gap-3 text-gray-500">
                <Mail className="h-5 w-5 shrink-0" />
                <p>sales@sentinel.ph</p>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="first-name"
                  className="block text-sm text-gray-900"
                >
                  First name
                </label>
                <Input
                  id="first-name"
                  name="first-name"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="last-name"
                  className="block text-sm text-gray-900"
                >
                  Last name
                </label>
                <Input
                  id="last-name"
                  name="last-name"
                  required
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-900">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm text-gray-900">
                Phone number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm text-gray-900">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                required
                className="min-h-[150px] w-full"
              />
            </div>

            <div className="flex justify-end">
              <button className="px-6 py-2 bg-[#82f4e5]  text-gray-700 font-bold rounded-tl-3xl transition-colors">
                Send message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
