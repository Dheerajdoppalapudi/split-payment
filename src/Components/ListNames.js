import { Button } from 'antd';
import React, { useCallback, useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react';

const ListNames = () => {

    const [nameValue, setNameValue] = useState('');
    const [memberList, setMemberList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [individualAmount, setIndividualAmount] = useState(0);
    const [showQR, setshowQR] = useState(null);
    const [receiverUPIID, setreceiverUPIID] = useState('');

    const addNamesList = () => {
        if (!nameValue.trim()) {
            return;
        }
        setMemberList([...memberList, nameValue])
        setNameValue('')
    }

    const removeItem = useCallback((index) => {
        setMemberList(prevList => prevList.filter((_, key) => key !== index))
    }, [])

    const calcIndvidualValue = useCallback((e) => {
        const updatedTotalAmount = parseFloat(e.target.value) || 0;
        setTotalAmount(updatedTotalAmount);
        if (memberList.length > 0) {
            setIndividualAmount(updatedTotalAmount / memberList.length);
        } else {
            setIndividualAmount(0);
        }
    }, [memberList, totalAmount])

    useEffect(() => {
        if (memberList.length > 0) {
            setIndividualAmount(totalAmount / memberList.length);
        } else {
            setIndividualAmount(0);
        }
    }, [memberList, totalAmount]);

    const DisplayQR = () => {
        if (memberList.length === 0 || totalAmount === 0) {
            return;
        }
        setshowQR(true);
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>UPI Payment Splitter</h2>

            {/* UPI ID Input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Add UPI ID:</label>
                <input
                    type='text'
                    value={receiverUPIID}
                    onChange={(e) => setreceiverUPIID(e.target.value)}
                    placeholder="Enter receiver's UPI ID"
                    style={{ padding: '5px', width: '300px' }}
                />
                <Button onClick={DisplayQR} type="default">
                    Create QR Code
                </Button>
            </div>

            {/* QR Code Display */}
            <div style={{ marginBottom: '20px' }}>
                {showQR && <CreateQR receiverUPIID={receiverUPIID} individualAmount={individualAmount} />
                }
            </div>

            {/* Name and Member List */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Enter Name:</label>
                <input
                    type='text'
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    placeholder="Enter name"
                    style={{ padding: '5px', width: '300px', marginRight: '10px' }}
                />
                <Button type="primary" onClick={addNamesList} style={{ marginRight: '10px' }}>
                    Submit
                </Button>
            </div>

            {/* Total Amount Input */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Total Amount:</label>
                <input
                    type='number'
                    value={totalAmount}
                    onChange={(e) => calcIndvidualValue(e)}
                    placeholder="Enter total amount"
                    style={{ padding: '5px', width: '300px' }}
                />
            </div>

            {/* Member List */}
            <div style={{ marginBottom: '20px' }}>
                <ListMembers
                    memberList={memberList}
                    removeItem={removeItem}
                    individualAmount={individualAmount}
                />
            </div>
        </div>
    )
}

const ListMembers = React.memo(({ memberList, removeItem, individualAmount, handlePay }) => {
    return (
        <div>
            <b>Members List</b>
            {memberList.map((val, key) => {
                return (
                    <div style={{ display: 'inline' }} key={key}>
                        <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ paddingRight: '10px' }}>{val}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <p style={{ margin: 0 }}>Amount: </p>
                                <input type="number" value={individualAmount} disabled />
                            </div>
                            <Button onClick={() => console.log("")}>Send Request</Button>
                            <Button onClick={() => removeItem(key)}>Delete</Button>
                        </li>
                    </div>
                );
            })}
        </div>
    );
});

const CreateQR = ({ receiverUPIID, individualAmount }) => {
    const upiLink = `upi://pay?pa=${receiverUPIID}&pn=Dheeraj&am=${individualAmount}&cu=INR`;

    return (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <h3>QR Code for Payment</h3>
            <QRCodeCanvas
                value={upiLink}
                size={200}
            />
            <p>Scan this QR code to pay Rs. {individualAmount} using PhonePe or any UPI app.</p>
        </div>
    );
};

export { ListNames }