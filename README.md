# DukaanDraft

An English-only local AI prototype for rewriting a small shop's offer into a short post. Built for the Hacktoberfest 2026 Week 2 Side Hustle challenge.

## Run locally

Requires Node.js 20+ and enough free RAM to load a 360M-parameter quantized model. Tested with Node 22 on Linux. Download and runtime size may be too large for low-memory devices.

```sh
npm install
npm start
```

Open http://127.0.0.1:8787 in a recent browser. First generation downloads hundreds of MB of model weights from Hugging Face. Later runs can reuse its local cache. No API key or new account is needed.

## What it does

Enter a shop name and short offer facts, generate a rewrite, compare it with the original facts, edit, and copy. No message is sent. Destination labels are organizational only; model prompts do not vary by channel yet.

The open-weight model is `onnx-community/SmolLM2-360M-Instruct-ONNX`, the ONNX conversion of Hugging Face's SmolLM2-360M-Instruct. Transformers.js runs inference locally in Node using the CPU.

- Model: https://huggingface.co/onnx-community/SmolLM2-360M-Instruct-ONNX
- Original model: https://huggingface.co/HuggingFaceTB/SmolLM2-360M-Instruct
- Runtime: https://huggingface.co/docs/transformers.js

## Limits and honest results

This is a prototype, not a commercial service. The small model may change a shop name, invent claims, or omit facts. A user must review every word before sharing. Tested sample: "Fictional Store has rice for Rs 50 per kg" generated "Fictional Store sells Rice at Rs 50 per Kg." Other samples produced unwanted claims such as "affordable" or changed a shop name. They are not safe to publish unchecked.

English only. No Hindi/Hinglish claim, customer trial, revenue, paid user, performance guarantee, or production hosting claim is made. Browser-only model inference and GitHub Models were explored but not verified; neither is the shipped route.

The side-hustle idea is an assisted post-writing service for local shops, with a person reviewing each draft. Willingness to pay has not been tested.

## Privacy and security

The server binds to 127.0.0.1, not the public network. It accepts only local same-origin requests. Shop text is processed locally after model downloads, not sent to an inference API by this app. Hugging Face receives model-file download requests. Do not enter customer secrets or personal information. Local model caches remain on the computer. The app has no database and no analytics.

## License

MIT for application code. Model weights retain their own license (SmolLM2 model card: Apache-2.0).
