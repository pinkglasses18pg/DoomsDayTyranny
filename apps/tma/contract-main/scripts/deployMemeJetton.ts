import { toNano } from '@ton/core';
import { MemeJetton } from '../wrappers/MemeJetton';
import { NetworkProvider } from '@ton/blueprint';
import { buildOnchainMetadata } from '../tests/utils';

const jettonParams = {
    name: 'DoomsDay Token',
    description: 'Hold it now, need it never...',
    symbol: 'DDT',
    image: 'https://asset.cloudinary.com/dirrbjxko/8c1fbfef9f39261b7b144c335b1be18e',
};

const secretKey =
    BigInt(
        0x03a2b3c4174b16c292a14f10e9f13aaa9c9dace1cd26938448a6dc70d81c165babab4faf7a97dc7f08c55abdace6e07541d75ccde8a439f61cdff2bfd6b40744n,
    );

const publicKey = BigInt(0xabab4faf7a97dc7f08c55abdace6e07541d75ccde8a439f61cdff2bfd6b40744n);

export async function run(provider: NetworkProvider) {
    const sender = provider.sender();
    if (sender.address === undefined) {
        throw new Error('Sender address is undefined');
    }
    const memeJetton = provider.open(
        await MemeJetton.fromInit(sender.address, buildOnchainMetadata(jettonParams), 10_000_000_000n, publicKey),
    );

    await memeJetton.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(memeJetton.address);

    // run methods on `memeJetton`
}
