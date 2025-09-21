import { useState } from 'react'
import { StyleSheet, Text, TextInput, Pressable, Keyboard, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGoals } from '../../hooks/useGoals'
import { useRouter } from 'expo-router'
import { auth } from '../../firebaseConfig'
import { Picker } from '@react-native-picker/picker'

const Create = () => {
  const [taskTitle, setTaskTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Study')

  const { createGoal } = useGoals()
  const router = useRouter();

  const handleSubmit = async () => {
    if (!taskTitle.trim()) return;

    await createGoal({
      title: taskTitle,
      description: description,
      category: category,
      progress: 0,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
    })

    // reset fields
    setTaskTitle('')
    setDescription('')
    setCategory('Study')
    Keyboard.dismiss()
    router.push('/goals')
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>📌 Add a New Task</Text>

        {/* Task Title */}
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        {/* Description */}
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Enter task description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Category Dropdown */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="📚 Study" value="Study" />
            <Picker.Item label="🏀 Sports" value="Sports" />
          </Picker>
        </View>

        {/* Submit */}
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Save Task</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F4',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2F5D50',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DDE5DC',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#DDE5DC',
    overflow: 'hidden',
  },
  button: {
    padding: 18,
    backgroundColor: '#2F5D50',
    borderRadius: 14,
    marginTop: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
})
