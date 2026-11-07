def hitung_bmi(berat, tinggi):
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi):
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    print("=== Program Penghitung BMI ===")
    berat = float(input("Masukkan berat badan (kg) : "))
    tinggi = float(input("Masukkan tinggi badan (m) : "))

    bmi = hitung_bmi(berat, tinggi)
    kategori = tentukan_kategori(bmi)

    print()
    print(f"Nilai BMI Anda          : {bmi:.2f}")
    print(f"Kategori                : {kategori}")


if __name__ == "__main__":
    main()
