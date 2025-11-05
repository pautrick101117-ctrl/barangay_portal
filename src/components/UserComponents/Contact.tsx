import { useState } from "react"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form Submitted:", formData)
    alert("Thank you for reaching out! We’ll get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/background-1.png')" }}
    >
      <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Contact Us</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea 
              id="message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              rows={5}
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              required
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>

      <footer className="mt-10 text-center text-white font-medium text-sm">
        <p>Barangay Iba, Silang, Cavite | Email: iba.silang@gmail.com | Phone: (046) 123-4567</p>
      </footer>
    </div>
  )
}

export default Contact
