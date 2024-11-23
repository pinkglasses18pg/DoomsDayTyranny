import "@stdlib/deploy";

message Add {
    amount: Int as uint32;
}

contract TestCase with Deployable {
    counter: Int as uint32;
    id: Int as uint32;
    bakers: map<Address, Int as uint64>;

    init(id: Int) {
        self.counter = 0;
        self.id = id;
    }

    receive("increment") {
        self.counter += 1;
    }

    receive("bake") {
        let ctx: Context = context();
        self.bakers.set(ctx.sender, ctx.value);
    }


    receive(msg: Add) {
        self.counter += msg.amount;
    }

    get fun counter(): Int{
        return self.counter;
    }

    get fun id(): Int{
        return self.id;
    }

    get fun myBalance(): Int {
        return myBalance();
    }

    get fun bakers(): map<Address, Int as uint64> {
        return self.bakers;
    }
}
