
const Tutorial = ({ coin, handler }) => {

    return (
        <div className="m-5">
            <h5><b>Bold</b> text means this step needs to be performed with the admin account.</h5>
            <div className="m-5">
                <h5>Transfer Coins</h5>
                <div className="entry-content">
                    <ul>
                        <li><b>Mint new coins to the desired address if needed. Specify Amount as larger than 0. Optionally conditions can be set.</b></li>
                        <li>All of your coins are listed on the bank website.</li>
                        <li>If Sender-conditions are attached to a coin, check the verification page with each condition.</li>
                        <li><b>If a condition is not fulfilled, enter it on the verification website.</b></li>
                        <li>If Receiver-conditions are attached to a coin, check the verification page with each condition.</li>
                        <li><b>If a condition is not fulfilled, enter it on the verification website.</b></li>
                        <li>Press the transfer of your choice on the bank website. If you want to transfer multiple coins, click the coressponding checkboxes and the buttons at the top.</li>
                        <li>Specify the receiver address.</li>
                        <li>If you want to set multiple conditions, press the green plus after entering the condition into the entry field. You can also remove already set conditions by pressing the red cross.</li>
                        <li>Finally confirm you want to do this transaction and also confirm this with metamask.</li>
                    </ul>
                </div>
                <h5>Setting up a Sponsorship</h5>
                <div className="entry-content">
                    <ul>
                        <li><b>Mint new coins to the desired address if needed. Specify Amount as larger than 0.</b></li>
                        <li>All of your coins are listed on the bank website.</li>
                        <li>You must first permit the coins you want to donate. The address of Smart Sponsor is written on the Sponsor website. Either press the permit button next to a coin or select checkboxes for multiple and press the button at the top. You must confirm with metamask.</li>
                        <li>Pressing the Create offer button on the sponsor website.</li>
                        <li>Select the coins, sender- and receiver-conditions. After entering a value, press the green plus. You can also remove set values by pressing the red cross.</li>
                        <li>Finally confirm you want to create this donation and confirm with metamask. After this the coins specified should dissappear from your wallet.</li>
                    </ul>
                </div>
                <h5>Apply for a Sponsorship</h5>
                <div className="entry-combat">
                    <ul>
                        <li>Find a Sponsorship you want to apply to on the sponsor website.</li>
                        <li>Check if you fulfill the sender conditions on the verify website.</li>
                        <li><b>Register any missing sender conditions on the verify website.</b></li>
                        <li>Apply for the sponsorship and confirm with metamask.</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Tutorial
