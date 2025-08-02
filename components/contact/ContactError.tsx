"use client";
interface ContactErrorProps {
  error?: string;
  formErrors?: { submit?: string };
}

const ContactError = ({ error, formErrors }: ContactErrorProps) => {
  return (
    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-red-700 text-sm font-medium">
          {error || formErrors?.submit}
        </p>
      </div>
    </div>
  );
};

export default ContactError;
