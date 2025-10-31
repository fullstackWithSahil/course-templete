import { Download, ExternalLink, FileText } from "lucide-react";
import React from "react";
import { handleDownload } from "./Options";

// Extract filename from URL
function getFilenameFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split("/").pop() || "download";
  } catch {
    return url.split("/").pop()?.split("?")[0] || "download";
  }
}

// Get file extension
function getFileExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toUpperCase();
  return ext || "FILE";
}


export default function Filemessage({ content }: { content: string }) {
  const filename = getFilenameFromUrl(content);
  const fileExtension = getFileExtension(filename);

  return (
    <div className="group relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* File Icon and Extension Badge */}
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="absolute -top-1 -right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-600 text-white">
            {fileExtension}
          </span>
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
            {filename}
          </h3>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => handleDownload(content)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          title="Open in new tab"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}