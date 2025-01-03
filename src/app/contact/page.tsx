'use client';
import React, { useState, FormEvent } from 'react';

export default function Contact() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    function formDataToObject(formData: FormData) {
        const obj: Record<string, any> = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        return obj;
    }
    
    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null); // Clear previous errors when a new request starts
     
        try {
          const formData = new FormData(event.currentTarget);
          
          // Log each entry in the FormData
          const formObject = formDataToObject(formData);
          console.log(formObject); // Logs all form data as a plain object

          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject),
          })

          if (!response.ok) {
            throw new Error('Failed to submit the data. Please try again.')
          }
     
          // Handle response if necessary
          const data = await response.json();
          console.log(data)
          
      } catch (error) {
          // Capture the error message to display to the user
          setError(error.message);
          console.error(error);
      } finally {
          setIsLoading(false);
        }
      }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>
      <form onSubmit={onSubmit}>
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