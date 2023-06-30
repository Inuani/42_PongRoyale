export function load({ params }): {chatName: string} {
    return {
        chatName: params.chat_code,
    }
}