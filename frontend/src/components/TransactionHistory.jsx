import React from "react";

const TransactionHistory = () => {
    const handleDownloadCSV = async () => {
        try {
            const response = await fetch("http://localhost:5000/transactions/export");
            if (!response.ok) throw new Error("Download Failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "transactions.csv";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.log("CSV Download Error:", error);
            alert("Failed to download CSV");
        }
    };

    return (
      <>
      
       <div>
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            <button
                onClick={handleDownloadCSV}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Download CSV
            </button>
        </div>
      </>
       
    );
};

export default TransactionHistory;
