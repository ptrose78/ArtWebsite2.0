
import { revalidatePath } from "next/cache";

export default function Contact() {
  async function handleSubmit(data: FormData) {
    "use server"; // Enable server action

    const name = data.get("name")?.toString() || "";
    const email = data.get("email")?.toString() || "";
    const message = data.get("message")?.toString() || "";

    if (!name || !email || !message) {
      throw new Error("All fields are required.");
    }

    // Simulate a backend process (e.g., send an email or save to a database)
    console.log("Contact form submitted:", { name, email, message });

    // Optional: Trigger revalidation of paths
    revalidatePath("/");
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <form
        action={handleSubmit}
        className="space-y-4"
        method="post"
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-teal-600 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
