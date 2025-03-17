const NotFoundPage: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md w-full mx-auto p-6 bg-white rounded-2xl shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">404 Not Found</h2>
                <p className="text-center text-gray-600">The page you are looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFoundPage;