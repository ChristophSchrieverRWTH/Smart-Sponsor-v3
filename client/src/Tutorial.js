
const Tutorial = ({ coin, handler }) => {

    return (
        <div className="m-5">
            <h5><b>Bold</b> text means this step needs to be performed with the admin account.</h5>
            <h5>Sender-conditions affect the person who sends money in a transaction. Receiver-conditions affect the person who receives money in a transaction.
                The Bank is never involved in a transaction.
            </h5>
            <div className="m-5">
                <h5>Transfer Coins</h5>
                <div className="entry-content">
                    <ul>
                        <li>All of your coins are listed on the bank website.</li>
                        <li><b>Mint new coins to the desired address if needed. Specify Amount as larger than 0. Optionally conditions can be set.</b></li>
                        <li>If Sender-conditions are attached to a coin, check if each condition is fulfilled using the verification page.</li>
                        <li><b>If a condition is not fulfilled, add a certificate on the verification website.</b></li>
                        <li>If Receiver-conditions are attached to a coin, check if each condition is fulfilled using the verification page.</li>
                        <li><b>If a condition is not fulfilled, have the receiver add a certificate on the verification website.</b></li>
                        <li>If you want to attach conditions while transferring coins, use the "Transfer and Attach" button</li>
                        <li>Press the transfer of your choice on the bank website. If you want to transfer multiple coins, click the corresponding checkboxes and one of the buttons at the top.</li>
                        <li>Specify the receiver address.</li>
                        <li>If you want to set conditions, specify the condition and press the corresponding confirm button. In this way multiple conditions can be set and using the red button removed.</li>
                        <li>Finally submit this transaction and also confirm this in metamask.</li>
                    </ul>
                </div>
                <h5>Setting up a Sponsorship</h5>
                <div className="entry-content">
                    <ul>
                        <li>All of your coins are listed on the bank website.</li>
                        <li style={{color: 'red'}}>Make sure the coins you want to donate do NOT have Receiver-conditions attached, as Smart Sponsor does not hold any certificates!</li>
                        <li><b>Mint new coins to the desired address if needed. Specify Amount as larger than 0.</b></li>
                        <li>You must first permit Smart Sponsor to access the coins you want to donate. The address of Smart Sponsor is written on the Sponsor website. Either press the permit button next to a coin or select checkboxes for multiple and press the button at the top. You must confirm in metamask.</li>
                        <li>Select the Coins, Spender- and Store-conditions. After entering a value, press the green confirm button. In this way multiple values can be set and using the red button removed.</li>
                        <li>Finally submit this donation and confirm in metamask. After this the coins specified should dissappear from your wallet.</li>
                    </ul>
                </div>
                <h5>Apply for a Sponsorship</h5>
                <div className="entry-combat">
                    <ul>
                        <li>Find a Sponsorship you want to apply for on the sponsor website.</li>
                        <li>Check if you fulfill the Spender-conditions using the verification website.</li>
                        <li><b>Register any missing Spender-conditions on the verify website.</b></li>
                        <li>Apply for the sponsorship and confirm in metamask.</li>
                        <li>The coins from the donation will now be listed on the bank website.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Tutorial
