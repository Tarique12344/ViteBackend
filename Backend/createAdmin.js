require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB for admin creation');

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in your .env');
            process.exit(1);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            if (!existingUser.isAdmin) {
                existingUser.isAdmin = true;
                await existingUser.save();
                console.log(`✅ User ${email} upgraded to admin`);
            } else {
                console.log(`✅ Admin ${email} already exists`);
            }
        } else {
            const user = new User({
                email,
                password,
                isAdmin: true,
            });
            await user.save();
            console.log(`✅ Admin ${email} created successfully`);
        }
    } catch (err) {
        console.error('❌ Error creating admin:', err);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdmin();
