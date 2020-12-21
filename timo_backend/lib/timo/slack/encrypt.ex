defmodule Timo.Slack.Encrypt do
  @aad "AES256GCM"
  @encrypt_secret_key Application.get_env(:timo, __MODULE__)[:encrypt_secret_key]

  def encrypt(val) do
    iv = :crypto.strong_rand_bytes(16)

    {ciphertext, ciphertag} =
      :crypto.block_encrypt(:aes_gcm, key(), iv, {@aad, to_string(val), 16})

    (iv <> ciphertag <> ciphertext)
    |> :base64.encode()
  end

  def decrypt(ciphertext) do
    ciphertext = :base64.decode(ciphertext)

    <<iv::binary-16, tag::binary-16, ciphertext::binary>> = ciphertext

    :crypto.block_decrypt(:aes_gcm, key(), iv, {@aad, ciphertext, tag})
  end

  defp key() do
    :base64.decode(@encrypt_secret_key)
  end
end
