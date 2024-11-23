import "@stdlib/deploy";
import "./jetton";
import "./jetton_default_wallet";

message Mint {
    amount: Int;
    receiver: Address;
}

message SignMint{
    data: Mint;
    signature: Slice;
}

contract MemeJetton with Jetton, Deployable {
    total_supply: Int as coins;
    owner: Address;
    content: Cell;
    mintable: Bool;

    max_supply: Int as coins; // Extract parameter we set here. The Jetton Standards doesn't have this parameter.
    p_key: Int as uint256;

    init(owner: Address, content: Cell, max_supply: Int, public_key: Int) {
        self.total_supply = 0;
        self.owner = owner;
        self.mintable = true;
        self.content = content;
        self.max_supply = max_supply;
        self.p_key = public_key;
    }

    receive(msg: Mint) { // 0xfc708bd2
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        require(self.mintable, "Not mintable");
        require(self.total_supply + msg.amount <= self.max_supply, "Max supply exceeded");
        self.mint(msg.receiver, msg.amount, self.owner); 
    }

    receive(msg: SignMint) {
        let hash: Int = msg.data.toCell().hash();
        let check: Bool = checkSignature(hash, msg.signature, self.p_key);
        require(check, "Invalid signature");
        require(self.mintable, "Not mintable");
        require(self.total_supply + msg.data.amount <= self.max_supply, "Max supply exceeded");
        self.mint(msg.data.receiver, msg.data.amount, self.owner);
    }

    receive("Owner: MintClose") {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Not owner");
        self.mintable = false;
    }
} 

