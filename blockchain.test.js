const Blockchain = require("./Blockchain");
const block = require("./block");
describe("blockchain", () => {
  let blockchain;
  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    orginalChain = blockchain.chain;
  });

  it("blockchain should have `chain` array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(block.genesis());
  });
  it("adds a new block to block chain", () => {
    const newData = "fooNewData";
    blockchain.addBlock({ data: newData });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });
  describe("isValidChain", () => {
    describe("starts with Genesis Block", () => {
      it("returns false", () => {
        blockchain.chain[0] = { data: "u got sum fake ass genesis block!" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    describe("starts with genesis block and have multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "test-one-data" });
        blockchain.addBlock({ data: "test-two-data" });
        blockchain.addBlock({ data: "test-three-data" });
      });
      describe("lasthash of a node has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].lastHash = "got some fakass lasthash nigah";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("Data of a block has changed", () => {
        it("returns false", () => {
          blockchain.chain[2].data = "some fake ass data ";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });
      describe("clean blockchain", () => {
        it("returns true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });
  describe("replaceChain", () => {
    describe("when the new chain is not long enough", () => {
      it("does not replace the chain", () => {
        newChain.chain[0] = { new: "chainis" };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(orginalChain);
      });
    });
    describe("when the newChain is longer", () => {
      beforeEach(() => {
        newChain.addBlock({ data: "test-one-data" });
        newChain.addBlock({ data: "test-two-data" });
        newChain.addBlock({ data: "test-three-data" });
      });
      describe("when the chain is valid", () => {
        it("does  replace chain", () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
        });
      });
      describe("when the chain is invalid", () => {
        it("does not replace chain", () => {
          newChain.chain[2].hash = "again some fake ass hash";
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(orginalChain);
        });
      });
    });
  });
});
