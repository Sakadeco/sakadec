// Script pour vérifier l'état du service sur Render
console.log('🔍 Vérification de l\'état du service Render...\n');

console.log('📋 Étapes de diagnostic :');
console.log('1. Allez sur votre dashboard Render');
console.log('2. Sélectionnez votre service backend SAKADECO');
console.log('3. Cliquez sur l\'onglet "Logs"');
console.log('4. Cherchez les messages suivants :\n');

console.log('✅ Messages à rechercher (configuration OK) :');
console.log('   - "✅ Service email initialisé"');
console.log('   - "📧 Configuration email:"');
console.log('   - "Host: smtp.gmail.com"');
console.log('   - "User: votre-email@gmail.com"');
console.log('   - "Pass: Configuré"');
console.log('');

console.log('❌ Messages d\'erreur à surveiller :');
console.log('   - "⚠️ Configuration email manquante"');
console.log('   - "❌ Erreur initialisation service email"');
console.log('   - "Invalid login"');
console.log('   - "ECONNREFUSED"');
console.log('   - "Authentication failed"');
console.log('');

console.log('🔧 Solutions selon les erreurs :');
console.log('');

console.log('❌ "Configuration email manquante" :');
console.log('   → Vérifiez que les variables sont bien ajoutées sur Render');
console.log('   → Redéployez le service après avoir ajouté les variables');
console.log('');

console.log('❌ "Invalid login" ou "Authentication failed" :');
console.log('   → Pour Gmail : Utilisez un App Password (pas votre mot de passe normal)');
console.log('   → Activez la 2FA sur votre compte Gmail');
console.log('   → Générez un nouveau App Password');
console.log('');

console.log('❌ "ECONNREFUSED" :');
console.log('   → Vérifiez EMAIL_HOST et EMAIL_PORT');
console.log('   → Pour Gmail : smtp.gmail.com:587');
console.log('   → Pour Outlook : smtp-mail.outlook.com:587');
console.log('');

console.log('❌ "Service email non configuré" dans les logs de paiement :');
console.log('   → Le service email n\'est pas initialisé');
console.log('   → Vérifiez les variables d\'environnement');
console.log('   → Redéployez le service');
console.log('');

console.log('🧪 Test recommandé :');
console.log('1. Effectuez une commande test sur votre site');
console.log('2. Surveillez les logs en temps réel');
console.log('3. Cherchez les messages d\'envoi d\'email');
console.log('4. Vérifiez votre boîte email');
console.log('');

console.log('📞 Si le problème persiste :');
console.log('1. Copiez les logs d\'erreur exacts');
console.log('2. Vérifiez que les variables sont bien visibles sur Render');
console.log('3. Testez avec un autre service email');
console.log('4. Vérifiez les paramètres de sécurité de votre compte email');
