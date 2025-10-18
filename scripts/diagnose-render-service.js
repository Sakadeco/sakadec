// Script de diagnostic complet pour le service Render
console.log('🔍 Diagnostic complet du service Render...\n');

console.log('📋 Étapes de diagnostic :');
console.log('');

console.log('1️⃣ Vérification des logs Render :');
console.log('   → Allez sur votre dashboard Render');
console.log('   → Sélectionnez votre service backend');
console.log('   → Cliquez sur "Logs"');
console.log('   → Cherchez les messages suivants :');
console.log('');

console.log('✅ Messages de succès à rechercher :');
console.log('   - "✅ Service email initialisé"');
console.log('   - "📧 Configuration email:"');
console.log('   - "Host: smtp.gmail.com"');
console.log('   - "User: votre-email@gmail.com"');
console.log('   - "Pass: Configuré"');
console.log('   - "✅ Stripe initialisé avec succès"');
console.log('');

console.log('❌ Messages d\'erreur à surveiller :');
console.log('   - "⚠️ Configuration email manquante"');
console.log('   - "❌ Erreur initialisation service email"');
console.log('   - "⚠️ Stripe non configuré"');
console.log('   - "❌ Erreur lors de l\'initialisation de Stripe"');
console.log('   - "Invalid login"');
console.log('   - "Authentication failed"');
console.log('   - "ECONNREFUSED"');
console.log('');

console.log('2️⃣ Vérification des variables d\'environnement :');
console.log('   → Dans Render, allez dans "Environment"');
console.log('   → Vérifiez que ces variables sont présentes :');
console.log('     • EMAIL_HOST');
console.log('     • EMAIL_PORT');
console.log('     • EMAIL_USER');
console.log('     • EMAIL_PASS');
console.log('     • ADMIN_EMAIL');
console.log('     • STRIPE_SECRET_KEY');
console.log('     • STRIPE_WEBHOOK_SECRET');
console.log('');

console.log('3️⃣ Test de configuration email :');
console.log('   → Si vous voyez "Configuration email manquante" :');
console.log('     • Vérifiez que les variables EMAIL_* sont définies');
console.log('     • Redéployez le service après ajout des variables');
console.log('   → Si vous voyez "Invalid login" :');
console.log('     • Pour Gmail : Utilisez un App Password');
console.log('     • Activez la 2FA sur votre compte Gmail');
console.log('     • Générez un nouveau App Password');
console.log('');

console.log('4️⃣ Test de configuration Stripe :');
console.log('   → Si vous voyez "Stripe non configuré" :');
console.log('     • Vérifiez STRIPE_SECRET_KEY');
console.log('     • Vérifiez STRIPE_WEBHOOK_SECRET');
console.log('     • Redéployez le service');
console.log('');

console.log('5️⃣ Test manuel recommandé :');
console.log('   → Allez sur https://sakadeco.fr');
console.log('   → Ajoutez un produit au panier');
console.log('   → Procédez au checkout');
console.log('   → Utilisez une carte de test Stripe :');
console.log('     • Succès : 4242 4242 4242 4242');
console.log('     • Échec : 4000 0000 0000 0002');
console.log('   → Surveillez les logs en temps réel');
console.log('   → Vérifiez votre boîte email');
console.log('');

console.log('6️⃣ Solutions selon les erreurs :');
console.log('');

console.log('❌ "Service email non configuré" :');
console.log('   → Variables d\'environnement manquantes');
console.log('   → Redéployez après avoir ajouté les variables');
console.log('');

console.log('❌ "Invalid login" ou "Authentication failed" :');
console.log('   → Problème d\'authentification email');
console.log('   → Pour Gmail : Utilisez un App Password');
console.log('   → Vérifiez vos identifiants');
console.log('');

console.log('❌ "Stripe non configuré" :');
console.log('   → Variables Stripe manquantes');
console.log('   → Vérifiez STRIPE_SECRET_KEY');
console.log('   → Vérifiez STRIPE_WEBHOOK_SECRET');
console.log('');

console.log('❌ Erreur 500 lors de la création de session :');
console.log('   → Problème de configuration Stripe');
console.log('   → Vérifiez les logs pour l\'erreur exacte');
console.log('   → Vérifiez que Stripe est correctement configuré');
console.log('');

console.log('📞 Si le problème persiste :');
console.log('1. Copiez les logs d\'erreur exacts');
console.log('2. Vérifiez toutes les variables d\'environnement');
console.log('3. Testez avec un autre service email');
console.log('4. Vérifiez la configuration Stripe');
console.log('5. Redéployez le service après chaque modification');
