export default function LoadingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
			<div className="text-center">
				{/* Spinner */}
				<div className="relative inline-block">
					<div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-full opacity-20 animate-pulse"></div>
					</div>
				</div>

				{/* Loading Text */}
				<h2 className="mt-6 text-2xl font-semibold text-gray-800 dark:text-gray-100">
					Loading...
				</h2>
				<p className="mt-2 text-gray-600 dark:text-gray-400">
					Redirecting you to the chat
				</p>

				{/* Animated Dots */}
				<div className="mt-4 flex justify-center space-x-2">
					<div
						className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
						style={{ animationDelay: "0ms" }}
					></div>
					<div
						className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
						style={{ animationDelay: "150ms" }}
					></div>
					<div
						className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"
						style={{ animationDelay: "300ms" }}
					></div>
				</div>
			</div>
		</div>
    )
}
