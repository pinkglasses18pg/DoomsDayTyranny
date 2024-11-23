import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Dictionary, toNano } from '@ton/core';
import { TestCase } from '../wrappers/TestCase';
import '@ton/test-utils';

describe.skip('TestCase', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let testCase: SandboxContract<TestCase>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        testCase = blockchain.openContract(await TestCase.fromInit(5000n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await testCase.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: testCase.address,
            deploy: true,
            success: true,
        });
    });

    it('should increace', async () => {
        const counterBefore = await testCase.getCounter();

        await testCase.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'increment',
        );

        const counterAfter = await testCase.getCounter();

        expect(counterBefore).toEqual(0n);
        expect(counterAfter).toEqual(1n);
    });

    it('should increace amount', async () => {
        const counterBefore = await testCase.getCounter();

        await testCase.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            { $$type: 'Add', amount: 5n },
        );

        const counterAfter = await testCase.getCounter();

        expect(counterBefore).toEqual(0n);
        expect(counterAfter).toEqual(5n);
    });

    it('should recieve coins from baker', async () => {
        await testCase.send(
            deployer.getSender(),
            {
                value: toNano('1.1'),
            },
            'bake',
        );

        const balance = await testCase.getMyBalance();

        expect(balance).toBeGreaterThan(toNano('1'));
    });

    it('should return baker list', async () => {
        await testCase.send(
            deployer.getSender(),
            {
                value: toNano('1.1'),
            },
            'bake',
        );

        const bakers = await testCase.getBakers();

        expect(bakers.get(deployer.address)).toBeGreaterThan(toNano('1'));
    });
});
