import React, { useEffect } from 'react';
import { Alert } from 'reactstrap';

function AlertPopup({ message = '', type = 'info', visible, setVisible }: any) {

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const onDismiss = () => setVisible(false);

    return (
        <Alert color={type} isOpen={visible} toggle={onDismiss}
            style={{
                position: 'absolute',
                right: '0px',
                top: '0px',
                zIndex: 9,
                margin: '5px',
                color: 'white'
            }}
        >
            {message}
        </Alert>
    );
}

export default AlertPopup;