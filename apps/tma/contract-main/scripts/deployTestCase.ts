import { toNano } from '@ton/core';
import { TestCase } from '../wrappers/TestCase';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const testCase = provider.open(await TestCase.fromInit(857435n));

    await testCase.send(
        provider.sender(),
        {
            value: toNano('0.1'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(testCase.address);

    // run methods on `testCase`
}
