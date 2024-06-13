import * as SecureStore from 'expo-secure-store';

async function saveItem(key, value) {
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
    }
    catch (err) {
        console.error(`Une erreur est survenue lors de la sauvegarde de l'élément ${key}:`, error);
    }
}

async function getItem(key)
{
    try {
        const result = await SecureStore.getItemAsync(key);
        if (result !== null) {
            return JSON.parse(result);
        } else {
            // console.log(`No item found for key ${key}.`);
            return null;
        }
    }
    catch (error) {
        console.error(`Une erreur est survenue lors de la recuperation de l'élément ${key}:`, error);
    }
}

async function clearItem(key) {
    try {
        await SecureStore.deleteItemAsync(key);
        console.log(`Item ${key} effacé avec succès.`);
    } catch (error) {
        console.error(`Une erreur est survenue lors de la suppression de l'élément ${key}:`, error);
    }
}

export { saveItem, getItem, clearItem };