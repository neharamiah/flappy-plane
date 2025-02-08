nume=1000
denome=9
r2= 0
r=0
i=0
import time

def fu(num, num1):
    global r,r2,i
    l = len(str(num))*10
    while r2>=0:
        i=i+l
        r=num-(num1*i)
        r2=num-(num1*(i+l))
    print(i,r,r2)
    i=0
    r2 = 1
    while r2>=0:
        i=i+1
        r=num-(num1*i)
        r2=num1-num1*(i+1)
        
start = time.time()


fu(nume,denome)

    
end = time.time()

print("quotient",i)
print("reminder ", r)
print(end - start)
