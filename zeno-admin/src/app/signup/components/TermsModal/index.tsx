'use client';
import CloseIcon from '@mui/icons-material/Close';
import React, { useState } from 'react';

type TermsModalProps = {
  open: boolean;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  onClose: () => void;
  onAgree: () => void;
};

export default function TermsModal({
  open,
  agreed,
  setAgreed,
  onClose,
  onAgree,
}: TermsModalProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  if (!open) return null;

  function handleAgree() {
    if (!agreed) {
      setLocalError('Please tick the checkbox to agree to the terms and conditions.');
      return;
    }
    setLocalError(null);
    onAgree();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(16,32,66,0.75)',
      }}
    >
      <div className="bg-[#091227] border border-[#9FF8F8] rounded-lg shadow-2xl p-8 w-full max-w-xl max-h-[80vh] overflow-y-auto relative">
        <div className="sticky top-0 z-10 flex justify-end ">
          <button
            onClick={onClose}
            className="text-[#9FF8F8] hover:text-white"
            aria-label="Close"
            style={{ marginRight: '-1rem', marginTop: '-1rem' }}
          >
            <CloseIcon fontSize="large" />
          </button>
        </div>

        <h2 className="text-3xl text-center font-bold mb-4 text-[#9FF8F8]">
          Zeno AI Terms and Conditions & Privacy Policy
        </h2>
        <div className="space-y-4 text-white text-base">
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">1. Introduction and Acceptance</h3>
            <p>
              This document outlines the terms and conditions for using the Zeno AI system, an AI-driven economic forecasting and decision-support agent. By accessing or using Zeno, you agree to comply with and be bound by these terms. Your use of the system constitutes explicit consent to the collection, processing, and use of your data as described herein, in accordance with the Kenya Data Protection Act, 2019, and other applicable laws.
            </p>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">2. Data Collection and Use</h3>
            <p>
              We collect and process your personal data for the purpose of providing Zeno&apos;s services, including economic forecasting, scenario analysis, and decision support. This data may include your full name and email address.
            </p>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">3. Data Security and Encryption</h3>
            <p>
              We are committed to protecting your data through appropriate security measures to prevent unauthorized access, modification, or disclosure. All sensitive data, including user-uploaded datasets and other confidential information, is protected.
            </p>
            <ul className="list-disc ml-6">
              <li>
                <span className='font-semibold'>Data in Transit:</span> Data sent between your device and our systems, as well as between Zeno&apos;s components and external APIs, is encrypted using secure protocols like TLS 1.3 to ensure confidentiality.
              </li>
              <li>
                <span className='font-semibold'>Data at Rest:</span> Sensitive data fields, including your full name and email address, are encrypted at rest using the AES-256 algorithm to prevent unauthorized access.
              </li>
              <li>
                <span className='font-semibold'>Password Security:</span> To protect your account, your password is not stored directly but is securely stored as a one-way cryptographic hash.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">4. Data Localization & Cross-Border Transfer</h3>
            <p>
              Your data may be processed in locations outside of Kenya to leverage global cloud infrastructure and to interact with core AI modules like the Gemini Large Language Model. We anonymize or pseudonymize Personally Identifiable Information (PII) before it is sent to external services to prevent the transfer of sensitive user information. By using Zeno, you consent to this data transfer and processing.
            </p>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">5. Your Rights</h3>
            <p>
              You have the following rights regarding your data in accordance with the Kenya Data Protection Act and GDPR:
            </p>
            <ul className="list-disc ml-6">
              <li>
                <span className='font-semibold'>Right to Data Deletion:</span> You have the right to request the deletion of your personal data from our systems. You can do this through the &quot;Delete Account&quot; option in your account settings. Upon your request, your data will be fully anonymized, and you will receive a confirmation.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">6. Chats Usage Policy</h3>
            <p>
              To ensure fair access for all users and maintain the quality of our service, we kindly ask you to be mindful of the following usage limits:
            </p>
            <ul className="list-disc ml-6 mb-3">
              <li>
                <span className='font-semibold'>Daily Chat Limit:</span> You may start up to 5 new chats per day.
              </li>
              <li>
                <span className='font-semibold'>Daily Query Limit:</span> Across all your chats, you can send up to 20 messages (queries) per day.
              </li>
            </ul>
            <p>
              You can continue any of your previous chats at any time—even older ones! The 20-query limit applies only to new messages you send in a single day, not to viewing or revisiting past conversations.
              We encourage you to make the most of each message by being clear and specific—this helps you get the best possible responses while staying within your daily allowance.
            </p>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">7. Transparency and Explainability</h3>
            <p>
              Zeno is designed to be a transparent AI system. We are committed to providing you with clear explanations of how the agent works and generates its outputs. The system will:
            </p>
            <ul className="list-disc ml-6">
              <li>Provide clear explanations for its recommendations, including the data used.</li>
              <li>Show how AI reasoning was applied for transparency.</li>
              <li>Offer detailed information on its architecture, trusted data sources, and model limitations.</li>
            </ul>
            <p>
              This information is designed to help you understand the outputs and make informed decisions, promoting the fair and transparent use of AI.
            </p>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">8. Contact Us</h3>
            <p>
              If you have any questions about this document or your data, please contact us at <span className='text-[#9FF8F8]'>zeno@gmail.com</span>.
            </p>
          </div>
          <div>
            <h3 className="text-2xl mb-3 text-[#9FF8F8]">Disclaimer</h3>
            <p>
              This is a draft document and not legal advice. It is provided to show compliance with your CRD, but you must have it reviewed and approved by a legal professional before use.
            </p>
          </div>
        </div>

        <div className="flex flex-col mt-6">
          <div className="flex items-center justify-between gap-4 w-full">
            <label className="flex items-center gap-2 select-none group w-full">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => {
                  setAgreed(!agreed);
                  setLocalError(null);
                }}
                className="accent-[#9FF8F8] h-5 w-5 cursor-pointer"
              />
              <span className="text-white text-base group-hover:underline cursor-pointer">
                Agree to terms and conditions
              </span>
            </label>
            <button
              className="bg-[#9FF8F8] text-[#0B182F] px-6 py-1 rounded-[10px] text-lg shadow transition-all hover:bg-cyan-100 cursor-pointer"
              onClick={handleAgree}
            >
              Agree
            </button>
          </div>

          {localError && (
            <div className="w-full text-red-400 text-center text-sm mt-2 mb-2 hover:underline">
              {localError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}