import React, { useState } from 'react';
import { Loader2, Mail, Send, Sparkles } from 'lucide-react';
import axios from 'axios';

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'apologetic', label: 'Apologetic' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
];

function App() {
  const [emailContent, setemailContent] = useState('');
  const [tone, settone] = useState('professional');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!emailContent.trim()) {
      setError('Please provide the email content you would like to reply to.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
      
    } catch (error) {
      setError("Unable to generate email. Please ensure you've provided the original email content.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mail className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Email Reply Generator</h1>
          </div>
          <p className="text-gray-600">Generate professional email responses with your preferred tone</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Original Email</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}
            <textarea
              value={emailContent}
              onChange={(e) => setemailContent(e.target.value)}
              placeholder="Paste the original email here..."
              className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Select Tone</h3>
              <div className="grid grid-cols-2 gap-3">
                {toneOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`cursor-pointer p-3 rounded-lg border transition-all ${
                      tone === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                    onClick={() => settone(option.value)}
                  >
                    <div className="font-medium text-gray-800">{option.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading || !emailContent.trim()}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Reply
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated Reply</h2>
            <div className="relative">
              <textarea
                value={generatedReply}
                readOnly
                placeholder="Your AI-generated reply will appear here..."
                className="w-full h-[calc(100%-2rem)] min-h-[400px] p-3 bg-gray-50 border border-gray-300 rounded-lg"
              />
              {generatedReply && (
                <button
                  onClick={() => navigator.clipboard.writeText(generatedReply)}
                  className="absolute top-[350px] right-3 p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  title="Copy to clipboard"
                >
                  <Send className="w-4 h-4 text-gray-600   " />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;