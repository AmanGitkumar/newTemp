import React, { useEffect, useState } from "react";

const BankDetails = () => {
    const [bankDetails, setBankDetails] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/bank/dummy-bank-details")
            .then((res) => res.json())
            .then((data) => setBankDetails(data))
            .catch((err) => console.error("Error fetching bank details:", err));
    }, []);

    if (!bankDetails) return <p>Loading bank details...</p>;

    return (
        <div className="bank-container">
            <h2>Bank Details</h2>
            <p><strong>Account Holder:</strong> {bankDetails.accountHolder}</p>
            <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
            <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
            <p><strong>IBAN:</strong> {bankDetails.iban}</p>
            <p><strong>SWIFT Code:</strong> {bankDetails.swiftCode}</p>
            <p><strong>Credit Card:</strong> {bankDetails.creditCardNumber} (CVV: {bankDetails.creditCardCVV})</p>

            <h3>Recent Transactions</h3>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {bankDetails.transactions.map((txn) => (
                        <tr key={txn.id}>
                            <td>{txn.date}</td>
                            <td>{txn.description}</td>
                            <td>₹{txn.amount}</td>
                            <td style={{ color: txn.type === "Credit" ? "green" : "red" }}>
                                {txn.type}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BankDetails;
