import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

type FAQ = {
  question: string
  answer: string
}

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQ[] = [
    {
      question: "HOW CAN I GET A BARANGAY CLEARANCE?",
      answer:
        "VISIT THE BARANGAY HALL, PRESENT A VALID ID, AND PAY THE REQUIRED PROCESSING FEE. THE PROCESS TAKES ABOUT 10–15 MINUTES.",
    },
    {
      question: "WHAT ARE THE REQUIREMENTS FOR BARANGAY ID?",
      answer:
        "BRING A VALID ID OR BIRTH CERTIFICATE, AND A PROOF OF RESIDENCY LIKE A UTILITY BILL OR BARANGAY CERTIFICATE. FILL OUT THE FORM AT THE HALL.",
    },
    {
      question: "WHERE CAN I FILE A COMPLAINT?",
      answer:
        "YOU CAN FILE A COMPLAINT THROUGH THE 'COMPLAINT BOX' SECTION IN YOUR DASHBOARD OR VISIT THE BARANGAY HALL DURING OFFICE HOURS.",
    },
    {
      question: "WHAT ARE THE OFFICE HOURS OF BARANGAY IBA?",
      answer:
        "OUR OFFICE IS OPEN MONDAY TO FRIDAY, FROM 8:00 AM TO 5:00 PM. CLOSED ON WEEKENDS AND HOLIDAYS EXCEPT FOR EMERGENCIES.",
    },
    {
      question: "HOW CAN I SUGGEST A PROJECT FOR OUR BARANGAY?",
      answer:
        "GO TO THE 'PROJECT SUGGESTION' PAGE IN YOUR DASHBOARD AND SUBMIT YOUR IDEA. THE BARANGAY COUNCIL WILL REVIEW IT SHORTLY.",
    },
    {
      question: "CAN I REQUEST A CERTIFICATION ONLINE?",
      answer:
        "YES! SOME DOCUMENTS CAN BE REQUESTED ONLINE THROUGH YOUR DASHBOARD ACCOUNT, DEPENDING ON AVAILABILITY.",
    },
    {
      question: "HOW DO I REPORT AN EMERGENCY?",
      answer:
        "DIAL THE BARANGAY HOTLINE POSTED ON THE DASHBOARD OR VISIT THE NEAREST BARANGAY OUTPOST FOR IMMEDIATE ASSISTANCE.",
    },
    {
      question: "HOW CAN I JOIN COMMUNITY ACTIVITIES?",
      answer:
        "CHECK THE 'NEWS' SECTION OR OUR FACEBOOK PAGE FOR UPCOMING EVENTS. REGISTRATION IS OFTEN FREE FOR RESIDENTS.",
    },
    {
      question: "IS THERE A SENIOR CITIZEN PROGRAM IN OUR BARANGAY?",
      answer:
        "YES, SENIOR CITIZENS CAN REGISTER FOR OUR MONTHLY WELLNESS PROGRAMS AND RECEIVE SPECIAL BENEFITS THROUGH THE OSCA OFFICE.",
    },
    {
      question: "WHERE CAN I SEE FUND TRANSPARENCY RECORDS?",
      answer:
        "YOU CAN VIEW FUND ALLOCATIONS AND EXPENSES IN THE 'FUND RECORDS' PAGE UNDER YOUR DASHBOARD.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="p-6 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-extrabold text-3xl text-center mb-8 text-[#333]">
          FREQUENTLY ASKED QUESTIONS (FAQs)
        </h1>

        <div className="bg-white rounded-2xl shadow-lg divide-y divide-gray-200">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 sm:p-6">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left text-gray-800 font-semibold hover:text-[#62DC87] transition-all"
              >
                <span className="flex-1 pr-4">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-[#62DC87]" />
                ) : (
                  <ChevronDown className="text-gray-500" />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed border-l-4 border-[#62DC87] pl-3">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQs
