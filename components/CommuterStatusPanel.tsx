
// FIX: Implemented the CommuterStatusPanel component and added a default export to resolve the import error in App.tsx.
import React from 'react';
import { CommuterStatus, CommuterStatusType, Destination } from '../types';
import { ClockIcon, GpsIcon, UsersIcon, CheckCircleIcon, SignalSlashIcon } from './icons/DetailIcons';
import { HandIcon } from './icons/HandIcon';
import { NavigationIcon } from './icons/AiIcons';
import { ApplePayIcon } from './icons/ApplePayIcon';

interface CommuterStatusPanelProps {
    status: CommuterStatus;
    isTripActive: boolean;
    onRequestStop: () => void;
    onHailTaxi: () => void;
    onCancelHail: () => void;
    destinations: Destination[];
    onSetDestination: (destination: Destination) => void;
    commuterName: string;
    onNameChange: (newName: string) => void;
    onApplePay: () => void;
    isProcessingPayment: boolean;
}

const CommuterStatusPanel: React.FC<CommuterStatusPanelProps> = ({ status, isTripActive, onRequestStop, onHailTaxi, onCancelHail, destinations, onSetDestination, commuterName, onNameChange, onApplePay, isProcessingPayment }) => {
    
    const renderStatusIcon = () => {
        switch (status.type) {
            case CommuterStatusType.WAITING_AT_RANK:
                return <ClockIcon className="text-yellow-400 w-12 h-12" />;
            case CommuterStatusType.AWAITING_PICKUP:
                return <GpsIcon className="text-blue-400 w-12 h-12" />;
            case CommuterStatusType.SELECTING_DESTINATION:
                return <NavigationIcon className="text-cyan-400 w-12 h-12" />;
            case CommuterStatusType.EN_ROUTE:
                return <UsersIcon className="text-green-400 w-12 h-12" />;
            case CommuterStatusType.APPROACHING_STOP:
                 return <HandIcon className="text-yellow-400 w-12 h-12" />;
            case CommuterStatusType.DROPPED_OFF:
                 return <CheckCircleIcon className="text-green-400 w-12 h-12" />;
            default:
                return <ClockIcon className="text-gray-400 w-12 h-12" />;
        }
    };

    const renderActionButton = () => {
        if (status.type === CommuterStatusType.EN_ROUTE || status.type === CommuterStatusType.APPROACHING_STOP) {
            return (
                <button 
                    onClick={onRequestStop}
                    disabled={!isTripActive}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 bg-yellow-600 hover:bg-yellow-500 text-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    <HandIcon />
                    Request Early Stop
                </button>
            );
        }

        if (status.type === CommuterStatusType.AWAITING_PICKUP) {
            return (
                <button 
                    onClick={onCancelHail}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 bg-red-600 hover:bg-red-500 text-white"
                >
                    <SignalSlashIcon />
                    Cancel Hail
                </button>
            );
        }
    
        if (status.type === CommuterStatusType.IDLE) {
            return (
                 <button 
                    onClick={onHailTaxi}
                    disabled={isTripActive}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-semibold transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 text-white disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                    <HandIcon />
                    Hail Taxi
                </button>
            );
        }
        
        return null;
    };

    const renderPaymentSection = () => {
        if (status.type !== CommuterStatusType.EN_ROUTE && status.type !== CommuterStatusType.APPROACHING_STOP) {
            return null;
        }

        return (
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                    <p className="font-semibold text-gray-300">Trip Fare</p>
                    <p className="font-bold text-white text-lg">R20.00</p>
                </div>
                {status.hasPaid ? (
                    <div className="flex items-center justify-center gap-2 text-green-400 font-semibold p-2 rounded-md bg-green-900/50 border border-green-700">
                        <CheckCircleIcon />
                        <span>Payment Confirmed</span>
                    </div>
                ) : (
                    <button
                        onClick={onApplePay}
                        disabled={isProcessingPayment}
                        className="w-full h-12 flex items-center justify-center rounded-lg font-semibold transition-all duration-300 bg-black text-white hover:bg-gray-800 border border-gray-600 disabled:opacity-70 disabled:cursor-wait"
                        aria-label="Pay R20.00 with Apple Pay"
                    >
                        {isProcessingPayment ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <>
                                <span className="mr-1">Pay with</span>
                                <ApplePayIcon />
                           </>
                        )}
                    </button>
                )}
            </div>
        );
    };

    if (status.type === CommuterStatusType.SELECTING_DESTINATION) {
        return (
            <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4 h-full">
                <h2 className="text-xl font-bold text-white border-b border-gray-700 pb-2">Select Destination</h2>
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                    <p className="text-gray-300 mb-4">{status.message}</p>
                    <div className="w-full space-y-2 max-h-64 overflow-y-auto pr-2">
                        {destinations.map((dest) => (
                            <button
                                key={dest.segmentIndex}
                                onClick={() => onSetDestination(dest)}
                                className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <span className="font-semibold text-white">{dest.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="bg-black/60 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-800 flex flex-col gap-4 h-full">
            <div className="border-b border-gray-700 pb-2">
                <input
                    type="text"
                    value={commuterName}
                    onChange={(e) => onNameChange(e.target.value)}
                    className="text-xl font-bold text-white bg-transparent w-full focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded-md px-2 -mx-2"
                    aria-label="Your name"
                    placeholder="Your Name"
                />
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center text-center" role="status" aria-live="polite">
                <div className="mb-4">
                    {renderStatusIcon()}
                </div>
                <h3 className="text-2xl font-bold text-white">
                    {status.destinationName ? `To: ${status.destinationName}` : status.message}
                </h3>
                {status.destinationName && <p className="text-lg text-gray-400">{status.message}</p>}
                
                {status.etaMinutes !== undefined && status.etaMinutes > 0 && (
                    <p className="text-xl text-cyan-400 font-mono mt-2">
                        ETA: {status.etaMinutes} min
                    </p>
                )}
                {status.countdownSeconds !== undefined && (
                    <p className="text-lg text-cyan-400 font-mono mt-2">
                        ETA: {Math.floor(status.countdownSeconds / 60)}:{(status.countdownSeconds % 60).toString().padStart(2, '0')}
                    </p>
                )}
                 {!isTripActive && status.type === CommuterStatusType.IDLE && (
                    <p className="text-gray-400 mt-2">The Taxi is not currently active.</p>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {renderPaymentSection()}
                {renderActionButton()}
            </div>
        </div>
    );
};

export default CommuterStatusPanel;