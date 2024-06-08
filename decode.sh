echo "Ingrese la clave para descifrar:"
read -s clave
if openssl enc -d -aes-256-cbc -salt -pbkdf2 -in firebase-config.enc -out firebase-config.ts -k "$clave"; then
    echo "Archivo descifrado correctamente."
else
    echo "Clave incorrecta. No se pudo descifrar el archivo"
    rm firebase-config.ts
fi
