import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";
import { Ionicons } from "@expo/vector-icons";

export default function NewScreen() {
  const router = useRouter();

  // タイトル
  const [title, setTitle] = useState("");

  // 年/月/日
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // 時/分/秒
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");

  // 登録ボタン
  const onPressRegister = async () => {
    if (!title) {
      Alert.alert("エラー", "タイトルを入力してください。");
      return;
    }
    if (!year || !month || !day || !hour || !minute || !second) {
      Alert.alert("エラー", "年/月/日、時/分/秒 をすべて入力してください。");
      return;
    }

    try {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);
      const h = parseInt(hour, 10);
      const min = parseInt(minute, 10);
      const s = parseInt(second, 10);

      // 不正な数値の場合
      if (
        isNaN(y) || isNaN(m) || isNaN(d) ||
        isNaN(h) || isNaN(min) || isNaN(s)
      ) {
        Alert.alert("エラー", "数値を正しく入力してください。");
        return;
      }

      // Dateオブジェクトを生成（JSの月は0始まりなので m - 1）
      const dateObj = new Date(y, m - 1, d, h, min, s);
      // 有効な日付かチェック（例: 2月30日などはInvalid Dateになる）
      if (isNaN(dateObj.getTime())) {
        Alert.alert("エラー", "有効な日付を入力してください。");
        return;
      }

      // 登録データ読み込み
      const jsonValue = await AsyncStorage.getItem("@registeredDates");
      let currentData = [];
      if (jsonValue) {
        currentData = JSON.parse(jsonValue);
      }

      // 新規データ作成
      const newItem = {
        id: uuid.v4().toString(),
        title,
        date: dateObj.toISOString(),
      };

      // データを追加して保存
      const updatedData = [...currentData, newItem];
      await AsyncStorage.setItem("@registeredDates", JSON.stringify(updatedData));

      // 一覧画面へ戻る
      router.push("/");
    } catch (error) {
      console.log(error);
      Alert.alert("エラー", "登録に失敗しました。");
    }
  };

  // キャンセルボタン
  const onPressCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4 text-center">登録</Text>

      {/* タイトル */}
      <Text className="mb-2">タイトル</Text>
      <TextInput
        className="border border-gray-300 rounded p-2 mb-4"
        placeholder="タイトルを入力"
        value={title}
        onChangeText={setTitle}
      />

      {/* 年月日 */}
      <Text className="mb-2">年月日</Text>
      <View className="flex-row items-center border border-gray-300 rounded p-2 mb-4">
        {/* 年 */}
        <TextInput
          className="flex-1 mr-2"
          placeholder="YYYY"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
        />
        {/* 月 */}
        <TextInput
          className="flex-1 mr-2"
          placeholder="MM"
          keyboardType="numeric"
          value={month}
          onChangeText={setMonth}
        />
        {/* 日 */}
        <TextInput
          className="flex-1 mr-2"
          placeholder="DD"
          keyboardType="numeric"
          value={day}
          onChangeText={setDay}
        />
        {/* カレンダーアイコン（装飾用途） */}
        <Ionicons name="calendar" size={24} color="black" />
      </View>

      {/* 時刻 */}
      <Text className="mb-2">時刻</Text>
      <View className="flex-row justify-between mb-4">
        {/* 時 */}
        <TextInput
          className="border border-gray-300 rounded p-2 w-[30%] text-center"
          placeholder="時"
          keyboardType="numeric"
          value={hour}
          onChangeText={setHour}
        />
        {/* 分 */}
        <TextInput
          className="border border-gray-300 rounded p-2 w-[30%] text-center"
          placeholder="分"
          keyboardType="numeric"
          value={minute}
          onChangeText={setMinute}
        />
        {/* 秒 */}
        <TextInput
          className="border border-gray-300 rounded p-2 w-[30%] text-center"
          placeholder="秒"
          keyboardType="numeric"
          value={second}
          onChangeText={setSecond}
        />
      </View>

      {/* 登録 & キャンセル ボタン */}
      <Pressable
        onPress={onPressRegister}
        className="bg-blue-500 rounded p-3 mb-2"
      >
        <Text className="text-white text-center font-bold">登録</Text>
      </Pressable>
      <Pressable
        onPress={onPressCancel}
        className="bg-gray-300 rounded p-3"
      >
        <Text className="text-center font-bold">キャンセル</Text>
      </Pressable>
    </View>
  );
}
