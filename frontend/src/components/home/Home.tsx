import React, { FormEvent } from 'react';
import { Search, Car, FileText, Users, CreditCard, HelpCircle } from 'lucide-react';

interface ServiceProps {
  title: string;
  icon: React.ReactNode;
  description: string;
}

// Card Components
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-white shadow ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

const CardContent: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Alert Component
interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ children, className = '' }) => (
  <div className={`rounded-lg border p-4 ${className}`}>
    {children}
  </div>
);

const AlertDescription: React.FC<AlertProps> = ({ children, className = '' }) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
);

const RTOHomePage: React.FC = () => {
  const services: ServiceProps[] = [
    {
      title: "Vehicle Registration",
      icon: <Car className="w-8 h-8 text-blue-600" />,
      description: "Register your new vehicle or transfer ownership"
    },
    {
      title: "License Services",
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      description: "Apply for new license, renewal, or duplicate license"
    },
    {
      title: "Permits & Documentation",
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      description: "Apply for various permits and documentation"
    },
    {
      title: "Learning License",
      icon: <Users className="w-8 h-8 text-orange-600" />,
      description: "Schedule test and apply for learning license"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="container px-4 py-8 mx-auto">
        {/* Search Section */}

        {/* Important Notice */}
        <Alert className="mb-8 border-yellow-200 bg-yellow-50">
          <AlertDescription>
            🔔 Important: All vehicle registrations now require online appointment booking.
            Please carry all original documents during your visit.
          </AlertDescription>
        </Alert>

        {/* Services Grid */}
        <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card key={index} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {service.icon}
                  <span>{service.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{service.description}</p>
                <button className="mt-4 font-medium text-blue-600 hover:text-blue-800">
                  Learn More →
                </button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Help Section */}
        <Card className="border-dashed bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="mb-2 text-xl font-semibold">Need Help?</h3>
                <p className="text-gray-600">
                  Contact our support team for assistance with any RTO-related services
                  or documentation requirements.
                </p>
                <a href='https://rtochatbot.streamlit.app/' target='_blank'>
                <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                  Contact our AI Assistant
                </button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-8 mt-12 text-white bg-gray-800">
        <div className="container px-4 mx-auto">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
              <p>Email: support@rto.gov.in</p>
              <p>Phone: 1800-XXX-XXXX</p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-300">FAQs</a></li>
                <li><a href="#" className="hover:text-blue-300">Forms Download</a></li>
                <li><a href="#" className="hover:text-blue-300">Fee Structure</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Working Hours</h3>
              <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday: 9:00 AM - 1:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RTOHomePage;