// #![feature(wasm_import_module, wasm_custom_section)]

extern crate sha3;
extern crate wasm_bindgen;
#[macro_use]
extern crate arrayref;

use sha3::{Digest, Sha3_256};
use wasm_bindgen::prelude::*;

#[test]
fn sha3_256_hash() {
    // let hash_abc = vec![
    //     186, 120, 22, 191, 143, 1, 207, 234, 65, 65, 64, 222, 93, 174, 34, 35, 176, 3, 97, 163,
    //     150, 23, 122, 156, 180, 16, 255, 97, 242, 0, 21, 173,
    // ];
    // assert_eq!(sha3_256(b"abc"), hash_abc);

    // let hash_test = vec![
    //     159, 134, 208, 129, 136, 76, 125, 101, 154, 47, 234, 160, 197, 90, 208, 21, 163, 191, 79,
    //     27, 43, 11, 130, 44, 209, 93, 108, 21, 176, 240, 10, 8,
    // ];
    // assert_eq!(sha3_256(b"test"), hash_test);

    let hash_bitcoin_ts = vec![
        250, 31, 145, 203, 239, 153, 71, 45, 26, 36, 211, 251, 64, 222, 43, 129, 109, 156, 58, 8,
        225, 70, 234, 3, 226, 123, 212, 17, 133, 173, 173, 175,
    ];
    assert_eq!(sha3_256(b"bitcoin-ts"), hash_bitcoin_ts);
}

// #[test]
// fn sha3_256_incremental_hash() {
//     let hash_bitcoin_ts = vec![
//         197, 172, 209, 87, 32, 54, 111, 116, 79, 74, 33, 12, 216, 172, 180, 55, 181, 8, 52, 10, 69,
//         75, 79, 77, 6, 145, 161, 201, 161, 182, 67, 158,
//     ];
//     let mut state = sha3_256_init();
//     let mut state = sha3_256_update(state.as_mut_slice(), b"bitcoin");
//     let mut state = sha3_256_update(state.as_mut_slice(), b"-ts");
//     assert_eq!(sha3_256_final(state.as_mut_slice()), hash_bitcoin_ts);
// }

#[wasm_bindgen]
pub fn sha3_256(input: &[u8]) -> Vec<u8> {
    // create a SHA3-256 object
    let mut hasher = Sha3_256::default();

    // write input message
    hasher.input(input);

    // read hash digest
    let out = hasher.result();
    return out.to_vec();
    // return Sha3_256::Digest(input).to_vec();
}

const SHA3_256_SIZE: usize = std::mem::size_of::<Sha3_256>();

#[wasm_bindgen]
pub fn sha3_256_init() -> Vec<u8> {
    let hasher = Sha3_256::new();
    let raw_state: [u8; SHA3_256_SIZE] = unsafe { std::mem::transmute(hasher) };
    raw_state.to_vec()
}

#[wasm_bindgen]
pub fn sha3_256_update(raw_state: &mut [u8], input: &[u8]) -> Vec<u8> {
    let raw_state2 = array_mut_ref!(raw_state, 0, SHA3_256_SIZE);
    let mut hasher: Sha3_256 = unsafe { std::mem::transmute(*raw_state2) };
    hasher.input(input);
    let raw_state3: [u8; SHA3_256_SIZE] = unsafe { std::mem::transmute(hasher) };
    raw_state3.to_vec()
}

#[wasm_bindgen]
pub fn sha3_256_final(raw_state: &mut [u8]) -> Vec<u8> {
    let raw_state2 = array_mut_ref!(raw_state, 0, SHA3_256_SIZE);
    let hasher: Sha3_256 = unsafe { std::mem::transmute(*raw_state2) };
    hasher.result().to_vec()
}