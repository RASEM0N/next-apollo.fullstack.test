export const loggerIsConnected = (isConnected: boolean): void => {
    if (isConnected) {
        console.log(`DB CONNECTED `.bgWhite.black + `            TRUE`.yellow)
    } else {
        console.log(`DB CONNECTED `.bgWhite.black + `            FALSE`.red)
    }
}

export const loggerServerStarted = (port: string | number) => {
    console.log(`Server started on a `.bgWhite.black + `     ${port}`.yellow)
}
