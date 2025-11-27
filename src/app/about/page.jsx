

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-4">
              Welcome to ShopHub, your trusted e-commerce destination for quality
              products at unbeatable prices.
            </p>
            <p className="text-gray-600 mb-4">
              We are committed to providing our customers with the best shopping
              experience, offering a wide range of products across various
              categories including electronics, fashion, home goods, and sports
              equipment.
            </p>
            <p className="text-gray-600">
              Our mission is to make online shopping easy, convenient, and
              enjoyable for everyone.
            </p>
          </div>
        </div>
      </main>
     
    </div>
  );
}

