

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-4">
              Have questions or need assistance? We're here to help!
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-600">support@shophub.com</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-gray-600">1-800-SHOPHUB</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Address</h3>
                <p className="text-gray-600">
                  123 Commerce Street<br />
                  Business City, BC 12345
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}

