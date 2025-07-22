import { Award, Download, Share2, Star, Trophy } from "lucide-react";
import React from "react";

export default function Content({
    firstName,
    pdfUrl,
}:{ 
    firstName: string;
    pdfUrl: string; 
}) {
	return (
		<main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-24 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Celebration Header */}
				<div className="text-center mb-8 sm:mb-12">
					<div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4 sm:mb-6 shadow-xl animate-bounce">
						<Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
					</div>
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-3 sm:mb-4 px-2">
						🎊 Congratulations! 🎊
					</h1>
					<p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6 px-4">
						You've successfully completed your course! Your
						certificate has been generated and is ready.
					</p>
					<div className="flex items-center justify-center gap-1 mb-6 sm:mb-8">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-current"
							/>
						))}
					</div>
				</div>

				{/* Certificate Display */}
				<div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-900/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
					<div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
						{/* Certificate Preview */}
						<div className="flex-1 w-full">
							<div className="relative group">
								<div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity dark:opacity-30 dark:group-hover:opacity-40"></div>
								<iframe
									src={pdfUrl}
									className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg border-4 border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-gray-900/50"
									title="Your New Certificate"
								/>
							</div>
						</div>

						{/* Achievement Panel */}
						<div className="lg:w-80 w-full">
							<div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 sm:p-6">
								<h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
									<Award className="w-5 h-5 text-blue-500 dark:text-blue-400" />
									Fresh Achievement!
								</h3>

								<div className="space-y-3 sm:space-y-4">
									<div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/30">
										<div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
										<span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
											Just Completed
										</span>
									</div>

									<div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-lg shadow-sm dark:shadow-gray-900/30">
										<Trophy className="w-5 h-5 text-orange-500 dark:text-orange-400" />
										<span className="text-gray-700 dark:text-gray-200 text-sm sm:text-base">
											Certificate Generated
										</span>
									</div>
								</div>

								<div className="mt-6 space-y-3">
									<a
										href={pdfUrl}
										target="_blank"
                                        download={"certificate.pdf"}
										rel="noopener noreferrer"
										className="w-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
									>
										<Download className="w-4 h-4" />
										Download Certificate
									</a>

									<button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 dark:hover:from-purple-700 dark:hover:to-purple-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
										<Share2 className="w-4 h-4" />
										Share Achievement
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Personal Success Message */}
				<div className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border border-green-200 dark:border-green-700 rounded-xl p-6 sm:p-8">
					<div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-green-400 to-blue-500 dark:from-green-500 dark:to-blue-600 rounded-full mb-4 sm:mb-6">
						<Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
					</div>
					<h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3 px-2">
						Outstanding Work, {firstName}
					</h3>
					<p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4 leading-relaxed">
						You've demonstrated commitment, perseverance, and
						excellence throughout this course. This certificate
						represents your dedication to learning and personal
						growth. Celebrate this achievement – you've earned it!
					</p>
				</div>
			</div>
		</main>
	);
}