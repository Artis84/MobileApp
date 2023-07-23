const { pubsub } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { firestore } = require("firebase-admin");
initializeApp();

exports.scheduleDocumentDeletion = pubsub.schedule("every 24 hours").onRun(async () => {
    const expirationTimeThreshold = firestore.Timestamp.now();
    // expirationTimeThreshold.seconds -= 60; // Subtract 24 hours in seconds

    const expiredDocumentsQuery = firestore().collection("users").where("expirationTime", "<", expirationTimeThreshold);
    const expiredDocumentsSnapshot = await expiredDocumentsQuery.get();

    const batch = firestore().batch();

    if (!expiredDocumentsSnapshot.empty) {
        expiredDocumentsSnapshot.forEach((doc) => {
            batch.delete(doc.ref);
            console.log(`Expired documents removed successfully ${doc.id}`);
        });
        await batch.commit();
        return;
    }
    console.log("No expired documents found");
});
