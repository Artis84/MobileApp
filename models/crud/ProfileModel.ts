class ProfileModel {
    removeCurrentSession = async (sessionId: string) => {
        try {
            const payLoad = {
                sessionId: sessionId,
            };

            const controller = new AbortController();
            const timeout = 10000;

            const timeoutId = setTimeout(() => {
                controller.abort();
                throw new Error();
            }, timeout);
            const response = await fetch("http://192.168.1.51:8000/logout", {
                signal: controller.signal,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payLoad),
            });

            clearTimeout(timeoutId);
            if (response.status === 500) return false;
            else return true;
        } catch (error) {
            throw new Error();
        }
    };
}
export default ProfileModel;
