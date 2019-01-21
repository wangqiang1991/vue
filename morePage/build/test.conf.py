print('python replace start')
infile = open("build\\test.authorization.js", mode='r', encoding='UTF-8')  #打开文件
outfile = open("dist\\static\\js\\authorization.js", mode='w', encoding='UTF-8') # 内容输出
for line in infile:  #按行读文件，可避免文件过大，内存消耗 
  outfile.write(line.replace('    ', '    ')) 
infile.close()    #文件关闭
outfile.close()   #文件关闭
print('python replace authorization.js complete')
